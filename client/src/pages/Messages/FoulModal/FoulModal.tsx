import React, { useState } from 'react';
import { Modal, Checkbox, Radio, Button, message } from 'antd';
import { ActionWithFoulMessages, Punishment, Rules } from '../../../utils/consts.tsx';

interface FoulModalProps {
	isFoulModalOpenOk: boolean;
	sendFoul: (selectedRules: number[], selectedActionWithFoul: number, selectedPunishment: number) => void;
	onCancel: () => void;
}

const FoulModal: React.FC<FoulModalProps> = ({ isFoulModalOpenOk, sendFoul, onCancel }) => {
	const [selectedRules, setSelectedRules] = useState<number[]>([]);
	const [selectedActionWithFoul, setSelectedActionWithFoul] = useState<number | null>(null);
	const [selectedPunishment, setSelectedPunishment] = useState<number | null>(null);

	const handleOk = () => {
        if (!selectedRules.length) {
            return message.error('Необходимо указать, какие правила нарушены!')
        }
		if (selectedActionWithFoul !== null && selectedPunishment !== null) {
			sendFoul(selectedRules, selectedActionWithFoul, selectedPunishment);
			resetModal();
			onCancel();
		}
	};

	const handleCancel = () => {
		resetModal();
		onCancel();
	};

	const resetModal = () => {
		setSelectedRules([]);
		setSelectedActionWithFoul(null);
		setSelectedPunishment(null);
	};

	const handleRuleChange = (rule: number) => {
		if (selectedRules.includes(rule)) {
			setSelectedRules(selectedRules.filter((r) => r !== rule));
		} else {
			setSelectedRules([...selectedRules, rule]);
		}
	};      

	const handleActionWithFoulChange = (action: string) => {
		const actionIndex = Object.values(ActionWithFoulMessages).findIndex((p) => p === action);
		setSelectedActionWithFoul(actionIndex);
	};

	const handlePunishmentChange = (punishment: string) => {
		const punishmentIndex = Object.values(Punishment).findIndex((p) => p === punishment);
		setSelectedPunishment(punishmentIndex);
	};

	return (
		<Modal
			title="Нарушение:"
			open={isFoulModalOpenOk}
			onOk={handleOk}
			onCancel={handleCancel}
			footer={[
				<Button key="cancel" onClick={handleCancel}>
					Отмена
				</Button>,
				<Button key="apply" type="primary" onClick={handleOk}>
					Применить
				</Button>,
			]}
		>
			<div>
				<h3>Нарушение правил:</h3>
				{Object.values(Rules)
					.filter((p) => typeof p === 'string')
					.map((rule, index) => (
						<Checkbox key={index} checked={selectedRules.includes(index)} onChange={() => handleRuleChange(index)}>
							{rule}
						</Checkbox>
					))}
			</div>
			<div>
				<h3>Действие с сообщением:</h3>
				{Object.values(ActionWithFoulMessages)
					.filter((p) => typeof p === 'string')
					.map((action, index) => (
						<Radio
							key={index}
							checked={selectedActionWithFoul === index}
							onChange={() => handleActionWithFoulChange(action)}
						>
							{action}
						</Radio>
					))}
			</div>
			<div>
				<h3>Наказание за нарушение:</h3>
				{Object.values(Punishment)
					.filter((p) => typeof p === 'string')
					.map((punishment, index) => (
						<Radio
							key={index}
							checked={selectedPunishment === index}
							onChange={() => handlePunishmentChange(punishment)}
						>
							{punishment}
						</Radio>
					))}
			</div>
		</Modal>
	);
};

export default FoulModal;
